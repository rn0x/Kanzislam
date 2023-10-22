import Users from './models/Users.js';
import Categories from './models/Categories.js';
import Topics from './models/Topics.js';
import Comments from './models/Comments.js';
import Tags from './models/Tags.js';
import Likes from './models/Likes.js';
import Reports from './models/Reports.js';
import Views from './models/Views.js';
import Notifications from './models/Notifications.js';
import Images from './models/Images.js';
import Videos from './models/Videos.js';
import Audios from './models/Audios.js';
import Pdfs from './models/Pdfs.js';
import Sitemap from './models/Sitemap.js';

/**
 * تستورد النماذج وتنشئ العلاقات بينها.
 * @param {Sequelize} sequelize - كائن Sequelize.
 * @returns {Object} - كائن يحتوي على النماذج المستوردة والعلاقات بينها.
 */

function model(sequelize) {
    const UsersModel = Users(sequelize);
    const CategoriesModel = Categories(sequelize);
    const TopicsModel = Topics(sequelize);
    const CommentsModel = Comments(sequelize);
    const TagsModel = Tags(sequelize);
    const LikesModel = Likes(sequelize);
    const ReportsModel = Reports(sequelize);
    const ViewsModel = Views(sequelize);
    const NotificationsModel = Notifications(sequelize);
    const ImagesModel = Images(sequelize);
    const VideosModel = Videos(sequelize);
    const AudiosModel = Audios(sequelize);
    const PdfsModel = Pdfs(sequelize);
    const SitemapModel = Sitemap(sequelize);


    CategoriesModel.hasMany(TopicsModel, { foreignKey: 'category_id', as: 'topics' });

    // Topics relationships
    TopicsModel.hasMany(LikesModel, { foreignKey: 'topic_id', as: 'likes', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    TopicsModel.hasMany(ViewsModel, { foreignKey: 'topic_id', as: 'views', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    TopicsModel.hasMany(ReportsModel, { foreignKey: 'topic_id', as: 'reports', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    TopicsModel.belongsTo(UsersModel, { foreignKey: 'user_id', as: 'users', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    TopicsModel.belongsTo(CategoriesModel, { foreignKey: 'category_id', as: 'categories', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    TopicsModel.hasMany(CommentsModel, { foreignKey: 'topic_id', as: 'comments', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    TopicsModel.hasMany(TagsModel, { foreignKey: 'topic_id', as: 'tags', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Users relationships
    UsersModel.hasMany(CommentsModel, { foreignKey: 'user_id', as: 'comments', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    UsersModel.hasMany(TopicsModel, { foreignKey: 'user_id', as: 'topics', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    UsersModel.hasMany(LikesModel, { foreignKey: 'user_id', as: 'likes', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    UsersModel.hasMany(NotificationsModel, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    UsersModel.hasMany(ReportsModel, { foreignKey: 'user_id', as: 'reports', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Media relationships
    VideosModel.belongsTo(UsersModel, { as: 'users', foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    AudiosModel.belongsTo(UsersModel, { as: 'users', foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    ImagesModel.belongsTo(UsersModel, { as: 'users', foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    PdfsModel.belongsTo(UsersModel, { as: 'users', foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    // Other relationships
    CommentsModel.belongsTo(TopicsModel, { foreignKey: 'topic_id', as: 'topics', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    CommentsModel.belongsTo(UsersModel, { foreignKey: 'user_id', as: 'users', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    LikesModel.belongsTo(UsersModel, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    ReportsModel.belongsTo(UsersModel, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

    return {
        Users: UsersModel,
        Categories: CategoriesModel,
        Topics: TopicsModel,
        Comments: CommentsModel,
        Tags: TagsModel,
        Likes: LikesModel,
        Reports: ReportsModel,
        Views: ViewsModel,
        Notifications: NotificationsModel,
        Images: ImagesModel,
        Videos: VideosModel,
        Audios: AudiosModel,
        Pdfs: PdfsModel,
        Sitemap: SitemapModel
    };
}

export default model;