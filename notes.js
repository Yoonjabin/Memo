const renderNotes = (notes, filters) => {
    const notesEl = document.querySelector('#notes');
  
    notes = sortNotes(notes, filters.sortBy);
    const filteredNotes = notes.filter((note) =>
      note.title.toLowerCase().includes(filters.searchText.toLowerCase())
    );
  
    notesEl.innerHTML = '';
  
    if (filteredNotes.length > 0) {
      filteredNotes.forEach((note) => {
        const noteEl = generateNoteDOM(note);
        notesEl.appendChild(noteEl);
      });
    } else {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = '검색 결과가 없습니다';
      emptyMessage.classList.add('empty-message');
      notesEl.appendChild(emptyMessage);
    }
  };
  
  const getSavedNotes = () => {
    const notesJSON = localStorage.getItem('notes');
    try {
      return notesJSON ? JSON.parse(notesJSON) : [];
    } catch (e) {
      return [];
    }
  };
  
  const saveNotes = (notes) =>
    localStorage.setItem('notes', JSON.stringify(notes));
  
  const sortNotes = (notes, sortBy) => {
    if (sortBy === 'byEdited') {
      return notes.sort((a, b) => {
        if (a.updatedAt > b.updatedAt) {
          return -1;
        } else if (a.updatedAt < b.updatedAt) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (sortBy === 'byCreated') {
      return notes.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        } else if (a.createdAt < b.createdAt) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (sortBy === 'alphabetical') {
      return notes.sort((a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      return notes;
    }
  };
  
  const generateNoteDOM = (note) => {
    const noteEl = document.createElement('div');
    const textEl = document.createElement('span');
  
    // Set up the note title text
    if (note.title.length > 0) {
      textEl.textContent = note.title;
    } else {
      textEl.textContent = '제목 없음';
    }
    noteEl.appendChild(textEl);
  
    return noteEl;
  };
  
  const filters = {
    searchText: '',
    sortBy: 'byEdited',
  };
  
  const notes = getSavedNotes();
  renderNotes(notes, filters);
  
  document.querySelector('#create-note').addEventListener('click', () => {
    const id = uuidv4();
    const timestamp = moment().valueOf();
  
    notes.push({
      id: id,
      title: '',
      body: '',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    saveNotes(notes);
    location.assign(`edit.html#${id}`);
  });
  
  document.querySelector('#search-text').addEventListener('input', (e) => {
    filters.searchText = e.target.value;
    renderNotes(notes, filters);
  });
