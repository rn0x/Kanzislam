import { DataTypes } from 'sequelize';

function Sitemap(sequelize) {
  return sequelize?.define('sitemap', {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    lastmod: {
      type: DataTypes.STRING,
      allowNull: true, // يجب أن يكون هذا الحقل قابلًا للفارغ (null).
    },
    changefreq: {
      type: DataTypes.STRING,
      allowNull: true, // يجب أن يكون هذا الحقل قابلًا للفارغ (null).
    },
    priority: {
      type: DataTypes.DECIMAL, // DECIMAL لدعم القيم العشرية.
      allowNull: true, // يجب أن يكون هذا الحقل قابلًا للفارغ (null).
    },
    images: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  });
}

export default Sitemap;