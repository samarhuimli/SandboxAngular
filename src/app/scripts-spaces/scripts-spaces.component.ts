// scripts-spaces.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-scripts-spaces',
  standalone: true,
  templateUrl: './scripts-spaces.component.html',
  styleUrls: ['./scripts-spaces.component.scss']
})
export class ScriptsSpacesComponent {
  templates = [
    {
      title: 'Python 3.12',
      description: 'Start with the latest stable Python version for modern development.',
      author: 'By github 😊'
    },
    {
      title: 'Python 3.9',
      description: 'Reliable LTS version ideal for stable production environments.',
      author: 'By github 😊'
    },
    {
      title: 'Python 3.7',
      description: 'Legacy version for compatibility with older systems.',
      author: 'By github 😊'
    }
  ];
}