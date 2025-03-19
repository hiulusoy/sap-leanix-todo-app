import {BaseService} from '../../../core/services/base.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LabelModel} from '../models/label.model';

/**
 * Service for handling label-related operations.
 * Provides methods for retrieving all labels and creating new labels.
 * Extends the BaseService to utilize common HTTP methods.
 */
@Injectable({
  providedIn: 'root'
})
export class LabelService extends BaseService {
  /**
   * Creates an instance of LabelService.
   * @param http - Angular's HttpClient for making HTTP requests
   */
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Retrieves all available labels from the backend.
   * @returns An Observable that emits an array of LabelModel objects
   */
  getLabels(): Observable<LabelModel[]> {
    return this.get<LabelModel[]>('/labels');
  }

  /**
   * Creates a new label with the specified name.
   * @param name - Name of the label to create
   * @returns An Observable that emits the newly created LabelModel
   */
  createLabel(name: string): Observable<LabelModel> {
    return this.post<LabelModel, { name: string }>('/labels', {name});
  }
}
