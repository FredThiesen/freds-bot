import path from "path";
import {
    DiscordGatewayAdapterCreator,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel
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

            connection.subscribe(player);

            // Create an audio resource from the specified file
            const resourcePath = path.join(__dirname, "assets", "fredy.mp3");
            const resource = createAudioResource(resourcePath);

            // Play the audio resource
            player.play(resource);

            //when the audio is over, disconnect
            player.on("stateChange", () => {
                connection.destroy();
            });

            return interaction.reply("Tocando o som do Fredy!");
        } catch (error) {
            console.error(error);
            return interaction.reply("Houve um erro ao tocar o som.");
        }
    }
};
