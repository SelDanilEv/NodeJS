const {Telegraf} = require('telegraf');
const bot = new Telegraf('1848176646:AAENeU2tB1uSThtccpzvres88opF5zJkzW0');
bot.command('start', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'За работу.', {})
});
bot.hears(/\/echo(.*)/, async ctx => {
    const text = ctx.match[1] || "Default";
    await ctx.reply(text);
});
bot.launch();

