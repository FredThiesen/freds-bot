// @ts-nocheck
import { SlashCommandBuilder } from "discord.js";
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    NoSubscriberBehavior,
    entersState,
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
            return interaction.reply(
                "Por favor, conecte-se a um canal de voz primeiro."
            );
        }

        // Cria conexão com o canal de voz
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log("Conexão pronta para reproduzir áudio!");
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
            } catch {
                connection.destroy();
            }
        });

        // Cria o player de áudio
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        // Recurso de áudio (o caminho do arquivo .mp3)
        const resource = createAudioResource(
            path.join(__dirname, "../assets", "fredy.mp3")
        );

        // Assina o player à conexão e inicia o áudio
        connection.subscribe(player);
        player.play(resource);

        player.on(AudioPlayerStatus.Playing, () => {
            console.log("O áudio está sendo reproduzido.");
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log("O áudio terminou.");
            connection.destroy(); // Desconecta ao finalizar o áudio
        });

        player.on("error", error => {
            console.error(`Erro no player: ${error.message}`);
            connection.destroy(); // Certifique-se de liberar a conexão em caso de erro
        });

        return interaction.reply("🪰");
    }
};
