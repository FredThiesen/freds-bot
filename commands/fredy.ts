import path from "path";
import {
    DiscordGatewayAdapterCreator,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState
} from "@discordjs/voice";
import { CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("freedy")
        .setDescription("Freeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeedy...."),
    async execute(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;
        const { channel } = member?.voice || {};
        if (!channel) {
            return interaction.reply(
                "vc precisa estar em um canal pra tocar música, jamelão 👺👺👺👺"
            );
        }

        try {
            const player = createAudioPlayer();

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild
                    ?.voiceAdapterCreator as DiscordGatewayAdapterCreator
            });

            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log("The bot has connected to the channel!");
            });

            connection.on(VoiceConnectionStatus.Disconnected, async () => {
                try {
                    await Promise.race([
                        entersState(
                            connection,
                            VoiceConnectionStatus.Signalling,
                            5_000
                        ),
                        entersState(
                            connection,
                            VoiceConnectionStatus.Connecting,
                            5_000
                        )
                    ]);
                    // Seems to be reconnecting to a new channel - ignore disconnect
                } catch (error) {
                    // Seems to be a real disconnect which SHOULDN'T be recovered from
                    connection.destroy();
                }
            });

            connection.subscribe(player);

            // Create an audio resource from the specified file
            const resourcePath = path.join(__dirname, "../assets", "fredy.mp3");
            const resource = createAudioResource(resourcePath);

            // Play the audio resource
            player.play(resource);

            player.on(AudioPlayerStatus.Playing, () => {
                console.log("The audio player has started playing!");
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log("The audio player is idle!");
                connection.destroy(); // Clean up the connection when done
            });

            player.on("error", error => {
                console.error("Error:", error.message);
                interaction.reply("Houve um erro ao tocar o som.");
            });

            return interaction.reply("Tocando o som do Fredy!");
        } catch (error) {
            console.error(error);
            return interaction.reply("Houve um erro ao tocar o som.");
        }
    }
};
