import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModel.js';
import ChatMessage from '../models/chatMessageModel.js';
import User from '../models/userModel.js';

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) { res.status(400); throw new Error('UserId param not sent'); }
    var isChat = await Chat.find({
        $and: [
            { participants: { $elemMatch: { $eq: req.user._id } } },
            { participants: { $elemMatch: { $eq: userId } } },
        ],
    }).populate("participants", "-password");
    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = { participants: [req.user._id, userId] };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("participants", "-password");
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400); throw new Error(error.message);
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate("participants", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name email",
                });
                res.status(200).send(results);
            });
    } catch (error) { res.status(400); throw new Error(error.message); }
});

const fetchMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await ChatMessage.find({ chatId: req.params.chatId })
            .populate("sender", "name email");
        res.json(messages);
    } catch (error) { res.status(400); throw new Error(error.message); }
});

export { accessChat, fetchChats, fetchMessages };