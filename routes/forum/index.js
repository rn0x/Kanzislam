import forum from './forum.js';
import createTopic from './createTopic.js';
import topic from './topic.js';

/**
 * routes forum
 * @param param
 */
export default async (param) => {
    await forum(param);
    await createTopic(param);
    await topic(param);
}