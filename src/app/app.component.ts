import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { uploadData } from 'aws-amplify/storage';

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
  handleClick() {
    if (this.selectedFile) {
      console.log(
        uploadData({
          data: this.selectedFile,
          path: `picture-submissions/${this.selectedFile.name}`,
          options: {
            // Specify a target bucket using name assigned in Amplify Backend
            bucket: 'amplifyTeamDrive',
          },
        })
      );
    }
  }
}
