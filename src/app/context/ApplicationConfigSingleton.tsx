import ApplicationConfigService from "./ApplicationConfigService";

export default class ApplicationConfigSingleton {

    private static applicationConfigService: ApplicationConfigService | undefined = undefined;
    private static ready = false;

    private constructor() {}

    private static initialize() {
        if (!ApplicationConfigSingleton.ready) {
            ApplicationConfigSingleton.applicationConfigService = new ApplicationConfigService();

            ApplicationConfigSingleton.ready = true;
        }
    }

    static getConfigServiceInstance(): ApplicationConfigService | undefined {
        ApplicationConfigSingleton.initialize();
        return ApplicationConfigSingleton.applicationConfigService;
    }
}
