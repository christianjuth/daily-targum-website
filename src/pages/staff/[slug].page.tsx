import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Section, Text, Grid, AspectRatioImage, Card, ActivityIndicator, Divider, FlatList, Ad, Sticky, SkipNav } from '../../components';
import { actions, GetAuthorPage } from '../../shared/src/client';
import { formatDateAbriviated } from '../../shared/src/utils';
import { processNextQueryStringParam, imgix } from '../../utils';
import NotFound from '../404.page';
import { useRouter } from 'next/router';
import styles from './[slug].module.scss';
import { theme } from '../../constants';

function Author({
  page
}: {
  page: GetAuthorPage | null
}) {
  const router = useRouter();

  if (router.isFallback) {
    return <ActivityIndicator.Screen/>;
  }

  if (!page) {
    return <NotFound/>;
  }

  return (
    <Section.StickyContainer className={styles.page}>
      <main>
        <SkipNav.Content/>
      
        <Grid.Row
          spacing={theme.spacing(20)}
          cols={[ '1fr', 'minmax(auto, 300px)' ]}
        >
          <Grid.Col xs={2} md={1}>
            <Grid.Row spacing={theme.spacing(2)} dangerouslyReverse>

              {page.author.headshot ? (
                <Grid.Col xs={24} md={6}>
                  <AspectRatioImage
                    data={imgix(page.author.headshot, {
                      xs: imgix.presets.sm('1:1')
                    })}
                    aspectRatio={1}
                    className={styles.avatar}
                  />
                </Grid.Col>
              ) : null}

              <Grid.Col xs={24} md={page.author.headshot ? 18 : 24}>
                <Text variant='h1' htmlTag='h1'>{page.author.displayName}</Text>
                {page.author.bio ? (
                  <Text variant='p' htmlTag='h2'>{page.author.bio}</Text>
                ) : null}
              </Grid.Col>
              
              <Grid.Col xs={24}>
                <Divider className={styles.divider}/>
              </Grid.Col>

              <Grid.Col xs={24}>
                <FlatList
                  data={page.articles}
                  keyExtractor={article => article.id}
                  renderItem={article => (
                    <Card.CompactResponsive
                      className={styles.articleCard}
                      title={article.title}
                      imageData={imgix(article.media[0]?.url ?? '', {
                        xs: imgix.presets.md('1:1')
                      })}
                      href='/article/[year]/[month]/[slug]'
                      as={'/'+article.slug}
                      aspectRatioDesktop={3/2}
                      date={formatDateAbriviated(article.publishDate)}
                    />
                  )}
                  ItemSeparatorComponent={<Card.Spacer/>}
                />
                {/* <ActivityIndicator.ProgressiveLoader
                  onVisible={() => console.log('implement progressive load')}
                /> */}
              </Grid.Col>

            </Grid.Row>

          </Grid.Col>

          <Grid.Col xs={0} md={1}>
            <Sticky>
              <Ad type='rectange' style={{ marginBottom: '1rem' }} />
              <Ad type='skyscraper' />
            </Sticky>
          </Grid.Col>

        </Grid.Row>
      </main>
    </Section.StickyContainer>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const page = await actions.getAuthorBySlug({
    slug: processNextQueryStringParam(ctx.params?.slug, '')
  });

  // TODO: add seo

  return {
    props: { 
      page: page ?? null
    },
    revalidate: 60 // seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () =>  {
  return {
    paths: [],
    fallback: true
  };
}

export default Author;