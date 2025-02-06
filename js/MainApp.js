const { createApp } = Vue;

const MainApp = {
    template: `
        <div>
            <h1 v-if="error">{{ message }}</h1>
        </div>
    `,
    data() {
        return {
            telegramId: '',
            app: '',
            data: null,
            message: '',
            error: false,
        }
    },
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);

        this.telegramId = urlParams.get('telegram_id') || '';
        this.app = urlParams.get('app') || '';

        try {
            const tgData = {
                organization: JSON.parse(urlParams.get('organization') || '[]'),
                projects: JSON.parse(urlParams.get('projects') || '[]'),
                categories: JSON.parse(urlParams.get('categories') || '[]'),
                priorities: JSON.parse(urlParams.get('priorities') || '[]')
            };

            if (Object.values(tgData).every(arr => Array.isArray(arr))) {
                console.log('Это данные (JSON):', tgData);
                this.data = tgData;
                console.log('Это данные организации', tgData.organization)
                window.tgData = tgData
            } else {
                throw new Error('Некорректные данные');
            }
        } catch (error) {
            console.error('Ошибка при парсинге JSON:', error);
            this.message = 'Ошибка загрузки данных';
            this.error = true;
        }
    },
    methods: {

    }
};

createApp(MainApp).mount('#main_app');
