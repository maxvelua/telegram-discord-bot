module.exports.getContentObject = async function (client, message, type) {
    var id,
        description;

    switch (type) {
        case 'photo':
            // 0 - miniature, 1 - original img
            id = message.photo[1].file_id;
            break;
        case 'video':
            id = message.video;
            break;
        case 'animation':
            id = message.animation;
            break;
        case 'voice':
            id = message.voice;
            break;
    }

    if (id) {
        var link = await client.getFileLink(id);
        description = message.caption ? message.caption : '';

        // added link to original message
        if (message.forward_from_chat) {
            description += '\n' + `<https://t.me/${message.forward_from_chat.username}/${message.forward_from_message_id}>`;
        }
    }

    return { description, files: [link] };
};