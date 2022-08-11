import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ResourceTypeManagerComponent } from './resource-type-manager.component';


export const routes: Routes = [
    {
        path: '',
        component: ResourceTypeManagerComponent,
    },
];
