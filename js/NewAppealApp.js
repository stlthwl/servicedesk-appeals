const { createApp } = Vue;

const NewAppealApp = {
    template: `
<!-- As a heading -->
        <nav class="navbar navbar-light bg-light">
          <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">Новое обращение</span>
          </div>
        </nav>

        <div>
            <h1 v-if="error">{{ message }}</h1>
        </div>
        
        <div class="mb-3">
          <label for="appealTopic" class="form-label">Заголовок</label>
          <input type="text" class="form-control" id="appealTopic" placeholder="Тема">
        </div>
        
        <div class="mb-3">
          <label for="organization" class="form-label">Организация</label>
          <select id="organization" class="form-select" disabled>
            <option>{{ organization['name'] }}</option>
          </select>
        </div>
        
        <div class="mb-3">
          <label for="appealProject" class="form-label">проект</label>
          <select id="appealProject" class="form-select">
            <option v-for="(key, value) in data.projects"
            :key="key"
            
            >{{ data.projects[key] }}</option>
          </select>
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
            data: {},
            organization: {},
            message: '',
            error: false,
        }
    },
    mounted() {
        try {
            const urlParams = new URLSearchParams(window.location.search);

            this.telegramId = urlParams.get('telegram_id') || '';
            this.app = urlParams.get('app') || '';

            console.log('app', this.app)

            if (this.app === 'create_appeal') {
                console.log('telegramId', this.telegramId)

                const tgData = {
                    organization: JSON.parse(urlParams.get('organization') || '[]'),
                    projects: JSON.parse(urlParams.get('projects') || '[]'),
                    categories: JSON.parse(urlParams.get('categories') || '[]'),
                    priorities: JSON.parse(urlParams.get('priorities') || '[]')
                };

                this.data = tgData

                console.log('tgData', this.data)

                this.organization = tgData.organization[0]

                console.log('organization', this.organization)

                if (Object.values(tgData).every(arr => Array.isArray(arr))) {
                    console.log('Это данные (JSON):', tgData);
                    console.log('Это данные организации', tgData.organization)
                } else {
                    throw new Error('Некорректные данные');
                }
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
