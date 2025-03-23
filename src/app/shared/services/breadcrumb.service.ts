import { Injectable } from "@angular/core";
import { MenuItem } from "primeng/api";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BreadcrumbService {

  private readonly _breadcrumbs$ = new BehaviorSubject<MenuItem[]>([]);

  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor() {}

  public addBreadcrumbs(breadcrumbs: MenuItem[]){
    if(breadcrumbs === null) {
      breadcrumbs = [];
    }
    this._breadcrumbs$.next(breadcrumbs);
  }

}