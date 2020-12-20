module.exports.getContentObject = async function (client, message, type) {
    var id,
        fileSize,
        description;

    switch (type) {
        case 'photo':
            // 0 - miniature, 1 - original img
            id = message.photo[1].file_id;
            fileSize = message.photo[1].file_size;
            break;
        case 'video':
            id = message.video;
            fileSize = message.video.file_size;
            break;
        case 'animation':
            id = message.animation;
            fileSize = message.animation.file_size;
            break;
        case 'sticker':
            id = message.sticker;
            fileSize = message.sticker.file_size;
    }

    if (id) {
        var link = await client.getFileLink(id);
        description = message.caption ? message.caption : '';

        // added link to original message
        if (message.forward_from_chat) {
            description += '\n' + `<https://t.me/${message.forward_from_chat.username}/${message.forward_from_message_id}>`;
        }
    }

    return { description, fileSize, files: [link] };
};