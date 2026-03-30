import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Roboto",
    lineHeight: 1.6,
    color: "#1c1c1e",
  },
  header: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 30,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  articleTitre: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 24,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  articleContenu: {
    fontSize: 10,
    fontWeight: 400,
    marginBottom: 12,
    textAlign: "justify",
  },
  separator: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5ea",
    marginVertical: 16,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    fontSize: 8,
    color: "#8e8e93",
    textAlign: "center",
  },
});

type BailArticle = {
  titre: string;
  contenu: string;
};

type BailPDFProps = {
  titre: string;
  articles: Record<string, BailArticle>;
};

function BailPDF({ titre, articles }: BailPDFProps) {
  const articleEntries = Object.entries(articles);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{titre}</Text>

        {articleEntries.map(([key, article], index) => (
          <View key={key} wrap={false}>
            {index > 0 && <View style={styles.separator} />}
            <Text style={styles.articleTitre}>{article.titre}</Text>
            <Text style={styles.articleContenu}>{article.contenu}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}

export async function genererBailPDF(
  titre: string,
  articles: Record<string, BailArticle>
): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <BailPDF titre={titre} articles={articles} />
  );

  return Buffer.from(buffer);
}