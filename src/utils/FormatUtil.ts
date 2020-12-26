import { File } from '../models/FileModel';
import { User } from '../models/UserModel';
import { EmbedInterface } from './interfaces/EmbedInterface';

/**
 * Format a file size to a human readable format.
 * @param {number} size The filesize in bytes.
 * @return {string} The formatted filesize.
 */
function formatFilesize(size: number): string {
    if (size === 0)
        return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const int = Math.floor(Math.log(size) / Math.log(1024));

    return `${(size / Math.pow(1024, int)).toFixed(2)} ${sizes[int]}`;
}

/**
 * Format a embed to fill out the templates.
 * @param {EmbedInterface} embed The embed settings.
 * @param {User} user The user who set the embed settings.
 * @param {File} file The file, if needed.
 * @return {EmbedInterface} The formatted embed.
 */
function formatEmbed(embed: EmbedInterface, user: User, file: File): EmbedInterface {
    for (const field of ['title', 'description', 'author']) {
        if (embed[field]) {
            embed[field] = embed[field]
                .replace('{size}', file.size)
                .replace('{username}', user.username)
                .replace('{filename}', file.filename)
                .replace('{uploads}', user.uploads)
                .replace('{date}', file.timestamp.toLocaleDateString())
                .replace('{time}', file.timestamp.toLocaleTimeString())
                .replace('{timestamp}', file.timestamp.toLocaleString())
                .replace('{domain}', file.domain);

            const TIMEZONE_REGEX = /{(time|timestamp):([^}]+)}/i;
            let match = embed[field].match(TIMEZONE_REGEX);

            while (match) {
                try {
                    const formatted = match[1] === 'time' ? file.timestamp.toLocaleTimeString('en-US', {
                        timeZone: match[2],
                    }) : file.timestamp.toLocaleString('en-US', {
                        timeZone: match[2],
                    });

                    embed[field] = embed[field].replace(match[0], formatted);
                    match = embed[field].match(TIMEZONE_REGEX);
                } catch (err) {
                    break;
                }
            }
        }
    }

    if (embed.randomColor)
        embed.color = `#${((1 << 24) * Math.random() | 0).toString(16)}`;

    return embed;
}

export {
    formatFilesize,
    formatEmbed
};
