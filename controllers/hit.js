require('dotenv').config();
const https = require('https');
const utils = require('../utils/datetime-converter');

const BCFORBP_COLUMNS = "BNR15;FIRMA;PLZ;ORT;ORTSTEIL;STR_NR;TELEFON;DBET_BIS";
const BESTREG_COLUMNS = "BNR15;DAT_VON;DAT_BIS;LOM;LOM5;GEB_DATR;GESCHL_X;RASSE_X;LOM_MUT;DAT_EIN";

getHitBCFORBP_URL = (condition) => {
  const entity = "BCFORBP";

  return process.env.HIT_API_URL + entity +
    "?columns=" + BCFORBP_COLUMNS +
    "&condition=" + condition +
    "&bnr=" + process.env.HIT_BNR +
    "&mbn=" + process.env.HIT_MBN +
    "&pin=" + process.env.HIT_PIN;
}

getHitBESTREG_URL = (dateFrom, dateTo, companies) => {
  const entity = "Bestandsregister"

  return process.env.HIT_API_SPEZIAL + entity + "?typ=BESTREG" +
    "&Von=" + dateFrom +
    "&Bis=" + dateTo +
    "&Sortierung=4" +
    "&betriebe=" + companies +
    "&ausgabe=" + BESTREG_COLUMNS +
    "&bnr=" + process.env.HIT_BNR +
    "&mbn=" + process.env.HIT_MBN +
    "&pin=" + process.env.HIT_PIN;
}

exports.getHitCompany = (req, res) => {
  console.log('Search for: ' + req.params.id);
  const condition = "BNR15;EQ;" + req.params.id + ";AND;DBET_BIS;GE;" + utils.getToday();

  const get_url = getHitBCFORBP_URL(condition);
  console.log('URL is: ' + get_url);

  https.get(get_url, hitResponse => {
    let data = '';
    hitResponse.on('data', chunk => {
      data += chunk;
    });

    hitResponse.on('end', () => {
      console.log('DATA is: ' + JSON.stringify(data));
      const json_data = JSON.parse(data);
      const hitStats = json_data.statistik;
      const hitResponse = json_data.daten.BCFORBP;

      if (hitStats.zeilen_total > 0) {
        const hitCompany = {
          bnr:      hitResponse[0].BNR15,
          firma:    hitResponse[0].FIRMA,
          plz:      hitResponse[0].PLZ,
          ort:      hitResponse[0].ORT,
          ortsteil: hitResponse[0].ORTSTEIL,
          str:      hitResponse[0].STR_NR,
          telefon:  hitResponse[0].TELEFON
        }
        res.status(200).json({
          message: 'OK - getting hits from HIT-DB',
          data: hitCompany
        });
      } else {
        res.status(404).json({
          message: 'NOT FOUND - getting no hits from HIT-DB'
        });
      }
    });
  });
}

exports.getHitInventory = (req, res) => {
  const dateFrom = utils.getDate(req.query.dateFrom);
  const dateTo = utils.getDate(req.query.dateTo);
  const bnr = +req.query.bnr;

  const get_url = getHitBESTREG_URL(dateFrom, dateTo, bnr);
  console.log(get_url);

  https.get(get_url, hitResponse => {
    let data = '';
    hitResponse.on('data', chunk => {
      data += chunk;
    });

    hitResponse.on('end', () => {
      const json_data = JSON.parse(data);
      const bestregArray = json_data['#BESTREG'];

      if (json_data) {
        res.status(200).json({
          message: 'OK - getting hits from HIT-DB',
          hitInventory: bestregArray,
          countHitInventory: bestregArray.length
        });
      } else {
        res.status(404).json({
          message: 'NOT FOUND - getting no hits from HIT-DB'
        });
      }
    });
  });
}
