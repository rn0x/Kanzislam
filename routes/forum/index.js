import forum from './forum.js';
import createTopic from './createTopic.js';
import topic from './topic.js';
import username from './username.js';
import tags from '../tags.js';

/**
 * routes forum
 * @param param
 */
export default async (param) => {
    await forum(param);
    await createTopic(param);
    await topic(param);
    await username(param);
    await tags(param);
}