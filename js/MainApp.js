const { createApp } = Vue;

const MainApp = {
    template: `
          <div>
            <h1 v-if="error">{{ message }}</h1>
          </div>>
        `,
    data() {
        return {
            telegramId: '',
            app: '',
            data: '',
            message: '',
            error: false,

        }
    },
    mounted() {
        const urlParams = new URLSearchParams(window.location.search)

        this.telegramId = urlParams.get('telegram_id') || '';
        this.app = urlParams.get('app') || '';

        try {
            this.data = {
                organization: JSON.parse(urlParams.get('organization') || '[]'),
                projects: JSON.parse(urlParams.get('projects') || '[]'),
                categories: JSON.parse(urlParams.get('categories') || '[]'),
                priorities: JSON.parse(urlParams.get('priorities') || '[]')
            };
            console.log('Это данные (JSON):', this.data);

            window.tg_data = this.data
        } catch (error) {
            console.error('Ошибка при парсинге JSON:', error);
            this.data = {}; // Или другое значение по умолчанию, если произошла ошибка
        }
    },
    methods: {

    }
};

createApp(MainApp).mount('#main_app')