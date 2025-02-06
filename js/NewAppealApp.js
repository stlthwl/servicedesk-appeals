const { createApp } = Vue;

const NewAppealApp = {
    template: `
        <div>
            <h1 v-if="error">{{ message }}</h1>
        </div>
        
        <div class="mb-3">
          <label for="appealTopic" class="form-label">Тема</label>
          <input type="text" class="form-control" id="appealTopic" placeholder="Тема">
        </div>
        <div class="mb-3">
          <label for="appealDescription" class="form-label">Содержание</label>
          <textarea class="form-control" id="appealDescription" rows="3"></textarea>
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
        try {
            const urlParams = new URLSearchParams(window.location.search);

            this.telegramId = urlParams.get('telegram_id') || '';
            this.app = urlParams.get('app') || '';

            console.log('telegramId', this.telegramId)
            console.log('app', this.app)

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

createApp(NewAppealApp).mount('#new_appeal_app');
