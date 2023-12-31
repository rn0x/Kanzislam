export default async (Categories) => {

    const dataCategories = [
        {
            id: 1,
            title: "التفسير والتأويل",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول تفسير القرآن الكريم وتأويله",
        },
        {
            id: 2,
            title: "الحديث النبوي",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول الحديث النبوي الشريف وعلومه",
        },
        {
            id: 3,
            title: "العقيدة والتوحيد",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول العقائد الإسلامية وتوحيد الله",
        },
        {
            id: 4,
            title: "الفقه والشريعة",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول الفقه الإسلامي والشريعة الإسلامية",
        },
        {
            id: 5,
            title: "التاريخ الإسلامي",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول التاريخ الإسلامي والأحداث الهامة في تطور الإسلام",
        },
        {
            id: 6,
            title: "السيرة النبوية",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول سيرة النبي محمد صلى الله عليه وسلم وأخلاقه",
        },
        {
            id: 7,
            title: "الأخلاق والأدب الإسلامي",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول الأخلاق والأدب الإسلامي والقيم الأخلاقية في الإسلام",
        },
        {
            id: 8,
            title: "التربية والتعليم الإسلامي",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول التربية والتعليم في الإسلام وأساليب التعليم الإسلامية",
        },
        {
            id: 9,
            title: "الصوم والصلاة والزكاة",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول الصوم والصلاة والزكاة وأحكامها في الإسلام",
        },
        {
            id: 10,
            title: "الحج والعمرة",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول مناسك الحج والعمرة وأحكامها",
        },
        {
            id: 11,
            title: "الصحة والطب النبوي",
            description: "تشمل هذه الفئة الدروس والمحاضرات والمناقشات حول الصحة والطب النبوي والنصائح الصحية المستمدة من سنة النبي محمد صلى الله عليه وسلم",
        },
        {
            id: 12,
            title: "الأدعية والأذكار",
            description: "شمل هذه الفئة الدروس والمحاضرات والمناقشات حول الأدعية والأذكار المأثورة في الإسلام وكيفية تطبيقها في الحياة اليومية",
        }

    ]

    for (let item of dataCategories) {

        const existingCategorie = await Categories.findOne({
            where: { title: item?.title },
        }).catch((error) => {
            console.log(error);
        });

        if (existingCategorie?.title !== item?.title) {

            await Categories.create({
                title: item?.title,
                description: item?.description,
            }).catch((error) => {
                console.error(`حدث خطأ أثناء إنشاء الفئة "${item?.title}" في قاعدة البيانات: `, error);
            });

            console.log(`تم إنشاء الفئة ${item?.title}`);
        }

    }

}