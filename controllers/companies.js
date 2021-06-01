require('dotenv').config();
const Company = require('../models/company');
const https = require('https');
const utils = require('../utils/datetime-converter');

exports.getCompanies = (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Company.find();
  let fetchedCompanies;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedCompanies = documents;
      return Company.countDocuments();
    })
    .then(count => {
      res.status(200).json({
       message: 'Companies fetched successfully',
       companies: fetchedCompanies,
       countCompanies: count
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching companies failed!'
      });
    });
}

exports.getCompany = (req, res) => {
  Company.findOne({'bnr': req.params.bnr})
    .then(company => {
      console.log(req.params.bnr);
      console.log(company);
      if (company) {
        res.status(200).json(company);
      } else {
        res.status(204).json({message: 'Company not found!'});
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching company failed!'
      });
    });
}

exports.getCompanyById = (req, res) => {
  Company.findById(req.params.bnrId)
    .then(company => {
      if (company) {
        res.status(200).json(company);
      } else {
        res.status(204).json({message: 'Company not found!'});
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching company failed!'
      });
    });
}

exports.importCompany = (req, res) => {
  const columns = "BNR15;BNR15_C;FIRMA;PLZ;ORT;ORTSTEIL;STR_NR;TELEFON;DBET_BIS";
  const condition = "BNR15;EQ;" + req.params.id + ";AND;DBET_BIS;GE;" + utils.getToday();
  const entity = "BPFORBC"

  const get_url = process.env.HIT_API_URL + entity +
    "?columns=" + columns +
    "&condition=" + condition +
    "&bnr=" + process.env.HIT_BNR +
    "&mbn=" + process.env.HIT_MBN +
    "&pin=" + process.env.HIT_PIN;
  console.log(get_url);

  https.get(get_url, (hitResponse => {
    let data = '';
    hitResponse.on('data', chunk => {
      // process.stdout.write(chunk);
      data += chunk;
    });

    hitResponse.on('end', () => {
      let json_data = JSON.parse(data);
      // console.log(json_data);
      let companies = [];
      let countErrors = 0;

      const hitStats = json_data.statistik;
      const hitResponse = json_data.daten.BPFORBC;

      for (let i = 0; i < hitStats.zeilen_total; i++) {
        const company = createCompany(hitResponse[i]);
        console.log("Firma: " + company.bnr + ", " + company._id);
        company.save()
          .then(createdCompany => {
            console.log("ErstellteFirma: " + createdCompany);
            companies.push({
              company: {
                ...createdCompany,
                id: createdCompany._id
              }
            })
          })
          .catch(() => {
            countErrors++;
          });
      }

      if (countErrors > 0) {
        res.status(500).json({
          message: 'Creating a company failed!',
          hitResponse: json_data
        });
      } else {
        res.status(201).json({
          message: hitStats.zeilen_total > 1 ?
            hitStats.zeilen_total + ' Companies successfully added!':
            hitStats.zeilen_total + ' Company successfully added!',
          companies: companies
        });
      }

      });
  }));
}

exports.createCompany = (req, res) => {
  const company = new Company({
    bnr: req.body.bnr,
    firma: req.body.firma,
    plz: req.body.plz,
    ort: req.body.ort,
    ortsteil: req.body.ortsteil,
    str: req.body.str,
    telefon: req.body.telefon
  });
  company.save()
    .then(createdCompany => {
      res.status(201).json({
        message: 'Company successfully added!',
        company: createdCompany,
        companyId: createdCompany._id
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
}

exports.deleteCompany = (req, res) => {
  Company.deleteOne({ bnr: req.params.bnr })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Betrieb entfernt!" });
      } else {
        res.status(401).json({ message: "Nicht autorisiert!" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Betrieb konnte nicht entfernt werden!" })
    });
}

exports.updateCompany = (req, res) => {}
