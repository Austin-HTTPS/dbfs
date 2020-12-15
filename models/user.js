const { Message } = require('discord.js');
const { Schema, model } = require('mongoose');
const config = require('../config.json');
const date = new Date();

const user = Schema({
    id: String,
    bio: {
        type: String,
        default: "This user does not have a bio yet."
    },
    vanity: {
        type: String,
        default: null
    },
    disabled: {
        type: Boolean,
        default: false       
    },
    deactivated: {
        type: Boolean,
        default: false
    },
    wezaconStaff: {
        type: Boolean,
        default: false
    },
    staff: {
        type: Boolean,
        default: false
    },
    support: {
        type: Boolean,
        default: false
    },
    partner: {
        type: Boolean,
        default: false
    },
    contributor: {
        type: Boolean,
        default: false
    },
    premium: {
        type: Boolean,
        default: false
    },
    badges: {
        type: Array
    },
    servers: {
        type: Array
    }
});

module.exports = model('user', user);