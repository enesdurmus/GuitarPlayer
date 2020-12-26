function FillDefaultSongs() {
    record = [];
    note0 = new Note(0,500);
    note1 = new Note(1,500);
    note2 = new Note(2,500);
    note3 = new Note(3,500);
    note4 = new Note(4,500);
    note5 = new Note(1,0);
    note6 = new Note(5,500);
    for (let i = 0; i < 6; i++) {
        record.push(note + "i");
    }
    song = new Song("Pirates Of The Caribbean", record);
    SongList.push(song);
}
FillDefaultSongs();