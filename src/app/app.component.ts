import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { uploadData } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();
Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, TodosComponent],
})
export class AppComponent {
  title = 'amplify-angular-template';
  selectedFile: File | null = null;
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  async handleClick() {
    if (this.selectedFile) {
      const s3Key = this.selectedFile.name;
      try {
        const result = await uploadData({
          path: `picture-submissions/${s3Key}`,
          // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
          data: this.selectedFile,
          options: {
            onProgress: ({ transferredBytes, totalBytes }) => {
              if (totalBytes) {
                console.log(
                  `Upload progress ${Math.round(
                    (transferredBytes / totalBytes) * 100
                  )} %`
                );
              }
            },
          },
        }).result;
        client.models.Video.create({
          title: 'Video 1',
          description: 'Video description',
          ownerName: 'Peter ISKANDER',
          s3Key: s3Key,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log('Path from Response: ', result.path);
      } catch (error) {
        console.log('Error : ', error);
      }
    }
  }
}
