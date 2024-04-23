import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { Routes } from '@angular/router';
import { ObservableTestComponent } from './pages/observable-test/observable-test.component';

export const routes: Routes = [
    {path: "home", component: HomeComponent},
    {path: "documentation", component: DocumentationComponent},
    {path: "observable-test", component: ObservableTestComponent},
];
