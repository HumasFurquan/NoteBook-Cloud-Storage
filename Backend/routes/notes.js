const express = require('express');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const router = express.Router();

// get all notes
router.get('/fetchallnotes', fetchuser, async (req,res)=>{
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

// add note
router.post('/addnote', fetchuser, [
  body('title').isLength({min:3}),
  body('description').isLength({min:5})
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors:errors.array() });

  const { title, description, tag } = req.body;
  const note = new Note({ title, description, tag, user:req.user.id });
  const saved = await note.save();
  res.json(saved);
});

// update note
router.put('/updatenote/:id', fetchuser, async (req,res)=>{
  const { title, description, tag } = req.body;
  const newNote = {};
  if(title) newNote.title = title;
  if(description) newNote.description = description;
  if(tag) newNote.tag = tag;

  let note = await Note.findById(req.params.id);
  if(!note) return res.status(404).send('Not Found (Either Id or auth-token is Invalid)');
  if(note.user.toString() !== req.user.id) return res.status(401).send('Not Allowed');

  note = await Note.findByIdAndUpdate(req.params.id, { $set:newNote }, { new:true });
  res.json(note);
});

// delete note
router.delete('/deletenote/:id', fetchuser, async (req,res)=>{
  let note = await Note.findById(req.params.id);
  if(!note) return res.status(404).send('Not Found (Either Id or auth-token is Invalid)');
  if(note.user.toString() !== req.user.id) return res.status(401).send('Not Allowed');

  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note Deleted Successfully" });
});

module.exports = router;
