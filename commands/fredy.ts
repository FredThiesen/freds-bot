// @ts-nocheck
import { SlashCommandBuilder } from "discord.js";
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus
} from "@discordjs/voice";
import path from "path";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("freedy")
        .setDescription("Freeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeedy...."),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.reply("Entre em um canal de voz");
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });
        const resource = createAudioResource(
            path.join(__dirname, "../assets", "fredy.mp3")
        );

        player.play(resource);
        connection.subscribe(player);

        setTimeout(() => {
            connection.destroy();
        }, [10000]);
    }
};
