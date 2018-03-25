Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'));

new Vue({
  name: 'notebook',

  el: '#notebook',

  data() {
    return {
      notes: JSON.parse(localStorage.getItem('notes')) || [],
      selectedId: localStorage.getItem('selected-id') || null
    }
  },

  computed: {
    selectedNote() {
      return this.notes.find(note => note.id === this.selectedId);
    },

    notePreview() {
      return this.selectedNote ? marked(this.selectedNote.content) : '';
    },

    sortedNotes() {
      return this.notes.slice()
        .sort((a, b) => a.created - b.created)
        .sort((a, b) => (a.favorite === b.favorite) ? 0 : a.favorite ? - 1 : 1);
    },

    linesCount() {
      if (this.selectedNote) {
        return this.selectedNote.content.split(/\r\n|\r\n/).length;
      }
    },

    wordsCount() {
      if (this.selectedNote) {
        var s = this.selectedNote.content;
        // Turn new line characters into white-spaces
        s = s.replace(/\n/g, ' ');
        // Exclude start and end white-spaces
        s = s.replace(/(^\s*)|(\s*$)/gi, '');
        // Turn 2 or more duplicate white-spaces into 1
        s = s.replace(/[ ]{2,}/gi, ' ');
        // Return the number of spaces
        return s.split(' ').length;
      }
    },

    charactersCount() {
      if (this.selectedNote) {
        return this.selectedNote.content.split('').length;
      }
    },

    addButtonTitle() {
      return this.notes.length + ' note(s) already';
    },

  },

  watch: {
    notes: {
      handler: 'saveNotes',
      deep: true
    },
    selectedId(val, oldVal) {
      localStorage.setItem('selected-id', val);
    }
  },

  methods: {
    addNote() {
      const time = Date.now();
      const note = {
        id: String(time),
        title: 'New note ' + (this.notes.length + 1),
        content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
        created: time,
        favorite: false
      };
      // Add
      this.notes.push(note);
      // Select
      this.selectNote(note);
    },

    removeNote() {
      if (this.selectedNote && confirm('Delete the note')) {
        const index = this.notes.indexOf(this.selectedNote)
        if (index !== -1) {
          this.notes.splice(index, 1);
        }
      }
    },

    selectNote(note) {
      this.selectedId = note.id
    },

    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes));
      console.log('Notes saved!', new Date());
    },

    favoriteNote() {
      this.selectedNote.favorite ^= true;
    }
  },

});
