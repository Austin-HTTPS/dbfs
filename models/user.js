const { Message } = require('discord.js');
const { Schema, model } = require('mongoose');
const config = require('../config.json');
const date = new Date();
const randomNumGen1 = Date.now();
const randomNumGen2 = Math.floor(Math.random() * 101);
const KEY = randomNumGen1 + randomNumGen2;

const user = Schema({
    id: String,
    apiKey: {
        type: String,
        unique: true,
        default: KEY
    },
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