// @ts-nocheck
const { SlashCommandBuilder } = require("discord.js");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus
} = require("@discordjs/voice");
const path = require("path");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("freedy")
        .setDescription("Freeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeedy...."),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.reply(
                "You need to be in a voice channel to use this command."
            );
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(
            path.join(__dirname, "assets", "fredy.mp3")
        );

        player.play(resource);
        connection.subscribe(player);

        setTimeout(() => {
            connection.destroy();
        }, [10000]);

        await interaction.reply("Playing audio in your voice channel.");
    }
};
