const { Thought, User } = require('../models');

const thoughtController = {
    addThought({body}, res) {
        Thought.create(body)
                .then(({ _id }) => {
                    return User.findOneAndUpdate(
                        { _id: body.userId },
                        { $push: {thoughts: _id}},
                        { new: true }
                    )
                })
                .then(dbUserData => {
                    console.log(dbUserData);
                    if(!dbUserData) {
                        res.status(404).json({ message: 'No user found with this id!'});
                        return;
                    }
                    res.json(dbUserData)
                })
                .catch(err => res.status(400).json(err));
    },
    getAllThought(req,res) {
    Thought.find({})
        .select('-__v')
        .sort({_id: -1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },  
    getThoughtById({params}, res) {
        Thought.findOne({_id: params.id})
                .select('-__v')
                .then(dbThoughtData => {
                    if(!dbThoughtData) {
                        res.status(404).json({message: 'No thought found with this id!'});
                        return;
                    }
                    res.json(dbThoughtData);
                })
                .catch(err => res.status(400).json(err));
    },

    updateThought({params, body}, res) {
        console.log(params);
        Thought.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    //remove Thought
    removeThought({params}, res) {
        Thought.findOneAndDelete({ _id: params.id})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    addReaction({params, body}, res) {
        Thought.findByIdAndUpdate(
            { _id: params.id},
            { $push: {reactions: body}},
            { new: true, runValidators: true}
        )
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },

    removeReaction({params, body}, res) {
        Thought.findByIdAndUpdate(
            { _id: params.id},
            { $pull: {reactions: {reactionId: params.reactionId}}},
            { new: true, runValidators: true}
        )
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },
}


module.exports = thoughtController;