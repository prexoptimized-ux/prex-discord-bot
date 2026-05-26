const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events
} = require('discord.js');

require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
});


// SEND VERIFY PANEL COMMAND
client.on('messageCreate', async (message) => {

    if (message.content === '!verifypanel') {

        const embed = new EmbedBuilder()
            .setColor('#ff5b00')
            .setTitle('🔐 Verification Required')
            .setDescription(
                'Click the button below to verify yourself and unlock all channels.'
            )
            .setFooter({
                text: 'Prex Optimization'
            });

        const verifyButton = new ButtonBuilder()
            .setCustomId('verify')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(verifyButton);

        await message.channel.send({
            embeds: [embed],
            components: [row]
        });
    }
});


// BUTTON SYSTEM
client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isButton()) return;

    if (interaction.customId === 'verify') {

        try {

            const verifiedRole = interaction.guild.roles.cache.get(
                process.env.VERIFY_ROLE_ID
            );

            const memberRole = interaction.guild.roles.cache.get(
                process.env.MEMBER_ROLE_ID
            );

            // GIVE ROLES
            await interaction.member.roles.add([
                verifiedRole,
                memberRole
            ]);

            // WELCOME EMBED
            const welcomeEmbed = new EmbedBuilder()
                .setColor('#5865F2')
                .setTitle('Welcome to Prex Optimization !!')
                .setDescription(
                    `Hey ${interaction.user}, Thanks for Verifying !!`
                )
                .addFields(
                    {
                        name: '👥 Member Count',
                        value: `${interaction.guild.memberCount}`,
                        inline: false
                    },
                    {
                        name: '🆔 User ID',
                        value: `${interaction.user.id}`,
                        inline: false
                    },
                    {
                        name: '🎭 Roles',
                        value: `${verifiedRole}, ${memberRole}`,
                        inline: false
                    }
                )
                .setThumbnail(
                    interaction.user.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setFooter({
                    text: 'Prex Optimization'
                })
                .setTimestamp();

            const welcomeChannel = interaction.guild.channels.cache.get(
                process.env.WELCOME_CHANNEL_ID
            );

            await welcomeChannel.send({
                embeds: [welcomeEmbed]
            });

            await interaction.reply({
                content: '✅ You are now verified!',
                ephemeral: true
            });

        } catch (err) {

            console.log(err);

            await interaction.reply({
                content: '❌ Verification failed.',
                ephemeral: true
            });
        }
    }
});

client.login(process.env.TOKEN);