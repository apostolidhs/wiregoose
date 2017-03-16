import React from 'react';
import Entry from '../../components/entry/Entry.jsx';
import '../../assets/img/entry-sample.jpg';

export default class ComponentsGallery extends React.Component {

  defaultEntryProps = () => ({
    title: `Το Γουδί ξανά στο προσκήνιο για τον
            Παναθηναϊκό ασδασδ ασδασδασδ ασδασδασδ`,
    image: 'http://localhost:8080/public/assets/img/entry-sample.jpg',
    description: `Αθλητική εφημερίδα υποστηρίζει ότι επανέρχεται το Γουδί
                    ως λύση στο γηπεδικό πρόβλημα του Παναθηναϊκού και
                    το Sport24.gr εξηγεί τι ισχύει με το νομικό καθεστώς
                    που επικρατεί στην περιοχή, αλασδασδ
                    σδασδασ σδφσδφσδφ σδφσδφ`,
    published: new Date(),
    link: 'http://www.sport24.gr/football/omades/Panathinaikos/'
          + 'to-goydi-ksana-sto-proskhnio-gia-ton-panathhnaiko.4577646.html',
    author: 'Μπάμπης Τσιμπίδας',
    provider: 'sport24',
  })

  render() {
    return (
      <Entry entry={this.defaultEntryProps()} />
    );
  }
}
