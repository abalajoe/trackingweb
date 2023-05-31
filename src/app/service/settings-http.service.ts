import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

export interface AppConfig {
  appInsightsKey: string;
}

//AppConfigService.ts
@Injectable({
  providedIn: 'root'
})
export class SettingsHttpService {
  private config: AppConfig | undefined;
  loaded = false;
  constructor(private http: HttpClient) {}
  loadConfig(): Promise<void> {
    return this.http
      .get<AppConfig>('/assets/settings.json')
      .toPromise()
      .then(data => {
        this.config = data;
        this.loaded = true;
      });
  }

  getConfig(): AppConfig {
    return <AppConfig>this.config;
  }
}
