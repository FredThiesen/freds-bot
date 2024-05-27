// @ts-nocheck
import {
    DiscordGatewayAdapterCreator,
    NoSubscriberBehavior,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel
} from "@discordjs/voice";
import {
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import play from "play-dl";

//@ts-ignore
module.exports = {
    data: new SlashCommandBuilder()
        .setName("soltaosom")
        .setDescription("Tocar uma música do youtube.")
        .addStringOption(option =>
            option
                .setName("musica")
                .setDescription("Bota o nome ou link da música")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        if (!interaction.isCommand()) return;
        if (!interaction.member) return;

        const argSongName = interaction.options.get("musica")?.value as string;
        const isUrl = argSongName.includes("https://");
        const member = interaction.member as GuildMember;

        const { channel } = member?.voice || {};
        if (!channel)
            return interaction.reply(
                "vc precisa estar em um canal pra tocar música, jamelão 👺👺👺👺"
            );

        const connection = joinVoiceChannel({
            channelId: channel.id,
            //@ts-ignore
            guildId: interaction.guildId,
            adapterCreator: interaction.guild
                ?.voiceAdapterCreator as DiscordGatewayAdapterCreator
        });

        const ytInfo = await play.search(argSongName, {
            limit: 1
        });

        const getMusicSource = () => {
            if (isUrl) return argSongName;
            if (!!ytInfo) return ytInfo[0].url;
            return "";
        };

        const musicSource = getMusicSource();
        if (!musicSource)
            return interaction.reply("Não achei essa música, jamelão 👺👺👺👺");
        try {
            const stream = await play.stream(musicSource);
            const audioResource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });

            player.play(audioResource);

            connection.subscribe(player);

            connection.on("stateChange", () => {
                if (connection.state.status === "disconnected") {
                    console.log("stopped");
                    player.stop();
                    interaction.fetchReply().then(message => {
                        message.react("✅");
                    });
                }
            });
        } catch (e) {
            return interaction.reply(
                "preciso de um link do youtube, jamelão 👺👺👺👺"
            );
        }

        const embed = new EmbedBuilder()
            .setColor(0x6c25be)
            .setTitle(!!ytInfo ? ytInfo[0].title : "Tocando sua música 📻🎶")
            .setURL(!!ytInfo ? ytInfo[0].url : "https://youtube.com")
            .setAuthor({
                name: !!ytInfo && ytInfo[0]?.channel.name,
                iconURL: ytInfo[0].channel.icons[0].url,
                url: ytInfo[0].channel.url
            })
            .setThumbnail(
                "https://github-production-user-asset-6210df.s3.amazonaws.com/38799478/273669562-727f5410-bbe6-43b9-9f2d-05d3074f13e4.png"
            )
            .setImage(
                //@ts-ignore
                ytInfo[0]?.thumbnails[0]?.url || ytInfo[0]?.thumbnail?.url
            )
            .setTimestamp()
            .setFooter({
                text: interaction.user.displayName + " 🎶",
                iconURL:
                    interaction.user.avatarURL({ forceStatic: true }) ||
                    interaction.user.defaultAvatarURL
            });

        if (!!ytInfo)
            interaction.reply({
                content: `Tocando agora: > 📻🎶 ${ytInfo[0].title} \n`,
                embeds: [embed]
            });
        else
            interaction.reply({
                content: `> Tocando sua música 📻🎶`,
                embeds: [embed]
            });
    },
    permissions: [
        PermissionsBitField.Flags.Connect,
        PermissionsBitField.Flags.Speak,
        PermissionsBitField.Flags.AddReactions,
        PermissionsBitField.Flags.ManageMessages
    ]
};
