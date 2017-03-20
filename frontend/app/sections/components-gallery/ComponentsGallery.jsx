import React from 'react';
import CSSModules from 'react-css-modules';
import _ from 'lodash';
import Entry from '../../components/entry/Entry.jsx';
import '../../assets/img/entry-sample.jpg';
import styles from './components-gallery.less';

@CSSModules(styles)
export default class ComponentsGallery extends React.Component {

  defaultEntryProps = () => ({
    title: `Το Γουδί ξανά στο προσκήνιο για τον
            Παναθηναϊκό ασδασδ ασδασδασδ ασδασδασδ
            ασδασδ ασδδεςασδασδ ασδασδσαδασδ`,
    image: 'http://localhost:8080/public/assets/img/entry-sample.jpg',
    description: `Αθλητική εφημερίδα υποστηρίζει ότι επανέρχεται το Γουδί
                    ως λύση στο γηπεδικό πρόβλημα του Παναθηναϊκού και
                    το Sport24.gr εξηγεί τι ισχύει με το νομικό καθεστώς
                    που επικρατεί στην περιοχή, αλασδασδ
                    σδασδασ σδφσδφσδφ σδφσδφ ασδασδασδ ργεφσδφαφδ
                    ασδιςεξιφρςεφ ςεφδςεδασδασδξι ςδφαδδφερφςσδ`,
    published: new Date(),
    link: 'http://www.sport24.gr/football/omades/Panathinaikos/'
          + 'to-goydi-ksana-sto-proskhnio-gia-ton-panathhnaiko.4577646.html',
    author: 'Μπάμπης Τσιμπίδας',
    provider: 'sport24',
  })

  render() {
    const entryData = this.defaultEntryProps();
    const entryDataNoAuthor = _.omit(this.defaultEntryProps(), 'author');
    return (
      <div className="w-m">
        <Entry entry={entryData} styleName="default-entry" />
        <Entry entry={entryDataNoAuthor} styleName="default-entry" />
      </div>
    );
  }
}
