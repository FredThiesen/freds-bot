// @ts-nocheck
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("freeedy")
        .setDescription("Freeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeedy...."),
    async execute(interaction) {
        await interaction.reply({ files: ["./assets/fredy.mp3"] });
    }
};
