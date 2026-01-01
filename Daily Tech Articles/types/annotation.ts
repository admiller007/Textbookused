export interface Annotation {
  id: string;
  articleId: string;             // Foreign key to Article

  // Selection info
  selectedText: string;
  startOffset: number;
  endOffset: number;
  anchorNode: string;            // DOM path for re-highlighting

  // Annotation content
  note: string;
  highlightColor: string;

  // Metadata
  createdDate: Date;
  updatedDate: Date;
}
