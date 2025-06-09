import { Component } from '@angular/core';

// Types for notes and categories/tags
interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

import { NgIf, NgFor, DatePipe, SlicePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
@Component({
  selector: 'noteease-main',
  standalone: true,
  templateUrl: './noteease-main.component.html',
  styleUrl: './noteease-main.component.css',
  imports: [
    CommonModule, NgIf, NgFor, FormsModule, DatePipe, SlicePipe
  ]
})
export class NoteeaseMainComponent {
  notes: Note[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchText: string = '';
  editingNote: Note | null = null;
  showNoteDialog = false;
  isCreatingNew = false;

  // PUBLIC_INTERFACE
  ngOnInit(): void {
    // Optionally, load from localStorage or API here.
    this.categories = ['All', 'Personal', 'Work', 'Ideas', 'Tasks'];
    this.selectedCategory = 'All';
  }

  // PUBLIC_INTERFACE
  get filteredNotes(): Note[] {
    let filtered = this.notes;
    if (this.selectedCategory && this.selectedCategory !== 'All')
      filtered = filtered.filter(n => n.category === this.selectedCategory);
    if (this.searchText.trim())
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          n.content.toLowerCase().includes(this.searchText.toLowerCase())
      );
    return filtered.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  // PUBLIC_INTERFACE
  openNewNoteDialog() {
    this.editingNote = { id: Date.now(), title: '', content: '', category: this.categories[1] || '', createdAt: new Date(), updatedAt: new Date() };
    this.isCreatingNew = true;
    this.showNoteDialog = true;
  }

  // PUBLIC_INTERFACE
  openEditNoteDialog(note: Note) {
    this.editingNote = { ...note }; // clone
    this.isCreatingNew = false;
    this.showNoteDialog = true;
  }

  // PUBLIC_INTERFACE
  closeNoteDialog() {
    this.editingNote = null;
    this.showNoteDialog = false;
    this.isCreatingNew = false;
  }

  // PUBLIC_INTERFACE
  saveNote() {
    if (!this.editingNote) return;
    if (!this.editingNote.title.trim()) return; // Require at least a title

    this.editingNote.updatedAt = new Date();

    if (this.isCreatingNew) {
      this.notes = [{ ...this.editingNote, createdAt: new Date() }, ...this.notes];
    } else {
      this.notes = this.notes.map(n => (n.id === this.editingNote!.id ? { ...this.editingNote! } : n));
    }
    if (!this.categories.includes(this.editingNote.category)) {
      this.categories.push(this.editingNote.category);
    }
    this.closeNoteDialog();
  }

  // PUBLIC_INTERFACE
  deleteNote(note: Note) {
    this.notes = this.notes.filter(n => n.id !== note.id);
    this.closeNoteDialog();
  }

  // PUBLIC_INTERFACE
  setCategoryFilter(cat: string) {
    this.selectedCategory = cat;
  }

  // PUBLIC_INTERFACE
  addCategory(category: string) {
    category = category.trim();
    if (category && !this.categories.includes(category)) {
      this.categories.push(category);
    }
  }
}
