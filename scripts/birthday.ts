//@ts-nocheck
import { Client, ChannelType, EmbedBuilder, userMention } from "discord.js";
import birthdayData from "../assets/birthdays_latruepa.json";
import moment from "moment";

interface Birthday {
    id: string;
    nome: string;
    date: string;
}

interface BirthdayData {
    birthdays: Birthday[];
}

async function checkAndSendBirthdayMessages(client: Client, channelId: string) {
    const data: BirthdayData = birthdayData as BirthdayData;
    const today = moment().format("DD-MM");
    console.log(`Today's date: ${today}`);

    const aniversariantes = data.birthdays.filter(
        birthday => birthday.date === today
    );
    console.log(`Birthdays today: ${JSON.stringify(aniversariantes)}`);

    try {
        if (aniversariantes.length > 0) {
            const channel = await client.channels.fetch(channelId);
            console.log(`Fetched channel: ${channel}`);

            if (channel && channel.type === ChannelType.GuildText) {
                aniversariantes.forEach(aniversariante => {
                    console.log(
                        `Sending birthday message to: ${aniversariante.nome}`
                    );

                    const userMentionString = userMention(aniversariante.id);

                    const embed = new EmbedBuilder()
                        .setColor("#FFD700")
                        .setTitle(
                            ` Feliz Aniversário, ${aniversariante.nome}! `
                        )
                        .setDescription(
                            `🙏 Tenha um dia abençoado, e que Deus te elimine! 🙏`
                        )
                        .addFields({
                            name: "Data",
                            value: aniversariante.date,
                            inline: true
                        })
                        .addFields({
                            name: "Aniversariante",
                            value: userMentionString,
                            inline: true
                        })
                        .setFooter({
                            text: "Reminder de aniversário do Fred's Bot"
                        });

                    channel.send({ embeds: [embed] });
                });
            } else {
                console.error(
                    `Canal ${channelId} não encontrado ou não é um canal de texto.`
                );
            }
        } else {
            console.log("Nenhum aniversário hoje.");
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem de aniversário:", error);
    }
}

export async function scheduleBirthdayCheck(client: Client, channelId: string) {
    const now = moment();
    const midnight = moment().hour(0).minute(1).second(59);
    // const midnight = moment().add(5, "seconds");

    let timeUntilMidnight = midnight.diff(now);

    if (timeUntilMidnight < 0) {
        midnight.add(1, "day");
        timeUntilMidnight = midnight.diff(now);
        console.log(`Adjusted time until midnight: ${timeUntilMidnight} ms`);
    }

    setTimeout(() => {
        console.log("Running initial birthday check");
        checkAndSendBirthdayMessages(client, channelId);
        setInterval(() => {
            console.log("Running daily birthday check");
            checkAndSendBirthdayMessages(client, channelId);
        }, 24 * 60 * 60 * 1000); // Repete a cada 24 horas
    }, timeUntilMidnight);
}
