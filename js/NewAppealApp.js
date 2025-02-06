const {createApp} = Vue;

const NewAppealApp = {
    template: `
        <div id="create_appeal">
            <!-- Start: Nav bar -->
            <nav class="navbar navbar-light bg-light">
                  <div class="container-fluid">
                        <span class="navbar-brand mb-0 h1">Новое обращение</span>
                  </div>
            </nav>
            <!-- End: Nav bar -->
    
            <!-- Start: Message group -->
            <div v-if="error" class="alert alert-danger" role="alert">
                {{ message }}
            </div>
            <div v-if="!error && submitted" class="alert alert-success" role="alert">
                {{ message }}
            </div>
            <!-- End: Message group -->
            
            <!-- Start: Form Group -->
            <form @submit.prevent="submitForm">
                <div class="mb-3">
                    <label for="appealTopic" class="form-label">Заголовок</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="appealTopic"
                        v-model="formData.topic" 
                        placeholder="Заголовок"
                        required
                    >
                </div>
                
                <div class="mb-3">
                    <label for="appealProject" class="form-label">Продукт</label>
                    <select 
                        id="appealProject" 
                        class="form-select"
                        v-model="formData.project_id"
                        required
                    >
                        <option 
                            v-for="project in projects"
                            :key="project.id"
                            :value="project.id"
                        >{{ project.name }}
                        </option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label for="userOrganization" class="form-label">Организация</label>
                    <select 
                        id="userOrganization" 
                        class="form-select" 
                        v-model="formData.organization_id"
                        required
                    >
                        <option
                            v-for="organization in organizations"
                            :key="organization.id" 
                            :value="organization.id"
                        >{{ organization.name }}
                        </option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label for="appealCategory" class="form-label">Категории</label>
                    <select 
                        id="appealCategory" 
                        class="form-select"
                        v-model="formData.category_id"
                        required
                    >
                        <option 
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.id"
                        >{{ category.name }}
                        </option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label for="appealPriority" class="form-label">Приоритет</label>
                    <select 
                        id="appealPriority" 
                        class="form-select"
                        v-model="formData.priority_id"
                        required
                    >
                        <option 
                            v-for="priority in priorities"
                            :key="priority.id"
                            :value="priority.id"
                        >{{ priority.name }}
                        </option>
                    </select>
                </div>
                
                <div class="mb-3">
                    <label for="appealDescription" class="form-label">Описание обращения</label>
                    <textarea 
                        class="form-control" 
                        id="appealDescription" 
                        rows="3" 
                        v-model="formData.description"
                        required
                    ></textarea>
                </div>
                
                <button type="submit" class="btn btn-lg btn-primary">Сохранить</button>
            </form>
            <!-- End: Form Group -->
        </div>    
    `,
    data() {
        return {
            telegramId: null,
            app: '',
            organizations: {},
            projects: {},
            categories: {},
            priorities: {},
            message: '',
            error: false,
            submitted: false,
            formData: {
                topic: '',
                project_id: null,
                organization_id: null,
                category_id: null,
                priority_id: null,
                description: ''
            },
        }
    },
    mounted() {
        try {
            const urlParams = new URLSearchParams(window.location.search);

            this.telegramId = urlParams.get('telegram_id') || '';
            this.app = urlParams.get('app') || '';

            // Проверка app
            if (this.app !== 'create_appeal') {
                const appElement = document.getElementById('create_appeal');
                if (appElement) {
                    appElement.style.display = 'none';
                }
                console.error(`Не найдено приложение ${this.app}`)
                return
            }

            // получение данных из Telegram
            const tgData = {
                organizations: JSON.parse(urlParams.get('organizations') || '[]'),
                projects: JSON.parse(urlParams.get('projects') || '[]'),
                categories: JSON.parse(urlParams.get('categories') || '[]'),
                priorities: JSON.parse(urlParams.get('priorities') || '[]')
            };

            console.log(tgData.organization)

            this.organizations = tgData.organizations
            this.projects = tgData.projects
            this.categories = tgData.categories
            this.priorities = tgData.priorities

            // Установка первой организации в выпадающем списке, если она есть
            if (this.organizations.length > 0) {
                this.formData.organization_id = this.organizations[0].id;
            }

            if (!Object.values(tgData).every(arr => Array.isArray(arr))) {
                throw new Error('Не удалось получить данные из Telegram');
            }

        } catch (e) {
            console.error('Ошибка при парсинге JSON:', e);
            this.message = 'Ошибка загрузки данных';
            this.error = true;
        }
    },
    methods: {
        async submitForm() {
            // Проверка работы Telegram Web
            if (window.Telegram && window.Telegram.WebApp) {
                console.log('Telegram Web is available')
            } else {
                this.message = 'Telegram Web не доступен'
                this.error = true
                return
            }
            // Проверка telegram_id
            if (this.telegramId === null) {
                this.message = 'Не удалось определить telegram_id'
                this.error = true
                return
            }

            // Преобразование данных формы в строку Json для передачи данных в Бот Telegram
            const jsonStrData = JSON.stringify(this.formData)

            console.log(jsonStrData)

            // Передача данных в Telegram Web App
            window.Telegram.WebApp.sendData(jsonStrData);

            this.submitted = true;
            this.message = 'Выполнено успешно!';
        }
    }
};

createApp(NewAppealApp).mount('#new_appeal_app');
