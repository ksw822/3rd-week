const express = require("express");
const Comment = require("../schemas/comment");
const router = express.Router();

//댓글 목록 조회
router.get("/:_postId", async (req, res) => {
  try {
    const _id = req.params._postId;

    if (!_id) { 
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const comments = await Comment.find({ postId: _id }).sort({ createdAt: -1 });

    let resultList = [];

    for (const comment of comments) {
      resultList.push({
        commentId: comment._id,
        user: comment.user,
        content: comment.content,
        createdAt: comment.createdAt,
      });
    }

    res.status(200).json({ data: resultList });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

//댓글 생성
router.post("/:_postId", async (req, res) => {
  try {
    const _id = req.params._postId;

    const user = req.body["user"];
    const password = req.body["password"];
    const content = req.body["content"];

    if (!content) { 
      res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      return;
    }

    if (!_id || !user || !password) { 
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }


    await Comment.create({ postId: _id, user, password, content });

    res.status(201).json({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 댓글 수정
router.put("/:_commentId", async (req, res) => {
  try {
    const _id = req.params._commentId;

    const password = req.body["password"];
    const content = req.body["content"];

    if (!content) { 
      res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      return;
    }

    if (!_id || !password) { 
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const isExist = await Comment.findOne({ _id, password });
    if (!isExist) {
      res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
      return;
    }

    await Comment.updateOne({ _id }, { $set: { content } });

    res.status(201).json({ message: "댓글을 수정하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

// 댓글 삭제
router.delete("/:_commentId", async (req, res) => {
  try {
    const _id = req.params._commentId;
    const password = req.body["password"];

    if (!_id || !password) { 
      res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      return;
    }

    const isExist = await Comment.findOne({ _id, password });

    if (!isExist || !_id) {
      res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
      return;
    }

    await Comment.deleteOne({ _id });
    res.status(201).json({ message: "댓글을 삭제하였습니다." });
  } catch (error) {
    const message = `${req.method} ${req.originalUrl} : ${error.message}`;
    console.log(message);
    res.status(400).json({ message });
  }
});

module.exports = router;
