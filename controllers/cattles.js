const Cattle = require('../models/cattle');
const utils = require('../utils/datetime-converter');
const converter = require('../utils/num-converter');

exports.getCattles = (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Cattle.find();
  let fetchedCattles;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedCattles = documents;
      return Cattle.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Rinder erfolgreich abgerufen',
        cattles: fetchedCattles,
        countCattles: count
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Rinder konnten nicht abgerufen werden'
      });
    });
}

exports.getCattlesByCccId = (req, res) => {
  const postQuery = Cattle.find({ cccId: req.params.cccId });
  let fetchedCattles;
  postQuery
    .then(documents => {
      fetchedCattles = documents;
      return Cattle.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'Rinder erfolgreich abgerufen',
        cattles: fetchedCattles,
        countCattles: count
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Rinder konnten nicht abgerufen werden'
      });
    });
}

exports.getCattle = (req, res) => {
  Cattle.findOne({'lom': req.params.lom})
    .then(cattle => {
      if (cattle) {
        res.status(200).json(cattle);
      } else {
        res.status(204).json({message: 'Rind nicht gefunden'});
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Rinder-Abfrage fehlgeschlagen'
      });
    });
}

exports.deleteCattlesByLom = (req, res) => {
  const cattles = req.body;
  cattles.forEach(lom => {
    Cattle.deleteOne({ lom: lom })
      .then(() => {
        // TODO: logging or debugging
      })
      .catch(err => {
        // TODO: log messages
        console.error(err.message);
      })
  })
  res.status(202).json({
    message: '(ausstehend) Rinder werden gelöscht...',
    cattlesToDelete: cattles.length
  });
}

exports.removeCattlesByCccId = (req, res) => {
  const cccId = req.params.cccId;
  console.log(JSON.stringify(cccId));
  Cattle.deleteMany({ cccId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: 'Rinder entfernt!' })
      } else {
        res.status(401).json({ message: "Nicht autor!siert!" });
      }
    }).catch(err => {
      res.status(500).json({ message: err.message });
    });
}

exports.saveCattles = (req, res) => {
  const cattles = req.body;
  cattles.forEach(cattleData => {
    let _lom5 = converter.getLom5(cattleData.lom5);
    let cattle = new Cattle({
      lom:      cattleData.lom,
      lom5:     _lom5,
      cccId:    cattleData.cccId,
      dateGeb:  utils.convertDateString2Date(cattleData.dateGeb),
      gender:   cattleData.gender,
      breed:    cattleData.breed
    });
    cattle.save()
      .then(() => {
        // TODO: logging or debugging
      })
      .catch(err => {
        // TODO: log messages
        console.error(err.message);
      })
  });
  res.status(202).json({
    message: '(ausstehend) Rinder werden gespeichert...',
    cattlesToSave: cattles.length
  });
}
