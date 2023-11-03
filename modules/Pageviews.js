import fetch from 'node-fetch';

export default ({ model }) => {
    return async (request, response, next) => {

        const currentPath = request?.originalUrl;
        const PathArray = [
            "/analytics",
            "/upload",
            "/data-history",
            "/data-quran",
            "/data-radio",
            "/tafsir-data",
            "/activate",
            "/login",
            "/logout",
            "/preview",
            "/puppeteer",
            "/register",
            "/reset-password",
            "/sitemap.xml",
            "/update-password",
            "/api/upload",
        ]

        if (!PathArray.includes(currentPath)) {

            const { Pageviews } = model
            // الحصول على عنوان IP الزائر
            const ip = request?.ip;
            const locationInfo = await getLocationInfo(ip);
            // قم بفك تشفير القيمة باستخدام decodeURIComponent()
            const decodedNameSurah = decodeURIComponent(currentPath);
            // الحصول على معلومات المتصفح والجهاز
            const userAgent = request?.get('User-Agent');
            const parsedUserAgent = parseUserAgent(userAgent);
            const lastPageviewsId = await Pageviews.max('view_id').catch((error) => {
                console.log('حدث خطأ:', error);
            });
            const newPageviewsId = lastPageviewsId + 1;
            await Pageviews.create({
                view_id: newPageviewsId,
                PagePath: decodedNameSurah,
                clientIp: ip,
                browserInfo: parsedUserAgent,
                locationInfo: locationInfo,
            }).catch((error) => {
                console.log(error);
            });

            request.Pageviews = {
                PagePath: decodedNameSurah,
                clientIp: ip,
                browserInfo: parsedUserAgent,
                locationInfo: locationInfo,
            };

        }

        next();
    };
};



// دالة لتحليل معلومات User-Agent
function parseUserAgent(userAgent) {
    try {
        const result = {};

        if (userAgent) {
            const parts = userAgent.split(' ');

            if (parts.length > 0) {
                const browserInfo = parts[parts.length - 1];
                result.browser = browserInfo.split('/')[0];
                result.browserVersion = browserInfo.split('/')[1];
            }

            if (parts.length > 1) {
                const osInfo = parts[1];
                result.os = osInfo.substring(1, osInfo.length - 1);
            }

            if (parts.length > 2) {
                result.device = parts.slice(2).join(' ');
            }
        }

        return result;
    } catch (error) {
        return { error: 'Unable to parse User-Agent' };
    }
}

// دالة للحصول على معلومات الموقع
async function getLocationInfo(clientIp) {
    try {
        const response = await fetch(`http://ip-api.com/json/${clientIp}`);
        const data = await response.json();

        if (data.status === 'success') {
            return {
                city: data.city,
                country: data.country,
                region: data.regionName,
            };
        } else {
            // console.log('Unable to retrieve location information');
            return undefined
        }
    } catch (error) {
        // console.log('An error occurred when retrieving location information');
        return undefined
    }
}