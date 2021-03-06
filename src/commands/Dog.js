const { Command } = require('@dyno.gg/dyno-core');
const superagent = require('superagent');

class Dog extends Command {
    constructor(...args) {
        super(...args);

        this.aliases      = ['dog', 'doggo'];
        this.module       = 'Fun';
        this.description  = 'Find some cute dog pictures';
        this.usage        = 'dog';
        this.example      = 'dog';
        this.cooldown     = 3500;
        this.expectedArgs = 0;
    }

    async execute({ message }) {
         try {
            const utils = this.utils;
            const errorText = `Error: ${this.config.emojis.saddog || ''} No dogs found.`;
			const responses = [
				{ search: 'Looking for a doggo...', found: 'Found one!' },
			];

			const response = responses[utils.getRandomInt(0, responses.length - 1)];
            const msg = await this.sendMessage(message.channel, response.search);

            let res = await superagent.get('https://dog.ceo/api/breeds/image/random');

            if (!res || !res.body || !res.body.message) {
                return this.error(message.channel, errorText);
            }

            return msg.edit({
                content: response.found,
                embed: {
                    title: `${this.config.emojis.dog || '🐶'} Woof!`,
                    color: 0x3498db,
                    image: {
                        url: res.body.message,
                    },
                    url: res.body.message,
                },
            });
        } catch(err) {
            return this.error(message.channel, errorText);
        }
    }
}

module.exports = Dog;
