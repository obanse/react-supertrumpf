require('dotenv').config();
const CcControl = require('../models/cc-control');

exports.getCcControls = (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = CcControl.find();
  let fetchedCcControls;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedCcControls = documents;
      return CcControl.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'CC-Controls fetched successfully',
        ccControls: fetchedCcControls,
        countCcControls: count
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching CC-Controls failed!'
      });
    });
}

exports.getCcControl = (req, res) => {
  let fetchedccControl;
  // TODO: Achtung fehlerhafte Rückgabe
  CcControl.findOne({ _id: req.params.id })
    .then(doc => {
      fetchedccControl = doc;
    })
    .then(() => {
      res.status(200).json({
        message: 'CC-Kontrolle gefunden',
        ccControl: fetchedccControl
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'CC-Kontrollenabruf fehlgeschlagen'
      });
    });
}

exports.createCcControl = (req, res) => {
  console.log(JSON.stringify(req.body));
  const ccControl = new CcControl({
    bnrId:        req.body.bnrId,
    firma:        req.body.firma,
    dateFrom:     req.body.dateFrom,
    dateTo:       req.body.dateTo,
    hasInventory: req.body.hasInventory,
    isStarted:    req.body.isStarted,
    isFinished:   req.body.isFinished
  });
  ccControl.save()
    .then(createdCcControl => {
      res.status(201).json({
        message: 'CC-Kontrolle erfolgreich angelegt!',
        ccControl: {
          ...createdCcControl
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        reqBody: req.body
      });
    });
}

exports.updateCcControl = (req, res) => {
  const cccId = req.params.id;
  const ccControlData = {
    ...req.body
  };
  CcControl.updateOne({ _id: cccId }, ccControlData)
    .then(result => {
      if (result.n > 0 && result.nModified > 0) {
        res.status(201).json({ message: `CC-Kontrolle aktualisiert!` });
      } else {
        res.status(401).json({ message: "Nicht autorisiert!" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
}

exports.deleteCcControl = (req, res) => {
  CcControl.deleteOne({ _id: req.params.id })
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

exports.setInventory = (req, res) => {
  const cccId = req.params.id;
  const inventory = req.body;

  CcControl.updateOne(
    { _id: cccId },
    { cattles: inventory, hasInventory: true })
    .then(result => {
      if (result.n > 0 && result.nModified > 0) {
        res.status(201).json({
          message: `${inventory.length} Rinder gespeichert`
        });
      } else {
        res.status(401).json({ message: "Nicht autorisiert!" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
}
