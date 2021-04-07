import * as React from 'react';
import { actions, GetPodcast } from '../../aws';
import { imgix, capitalizedToHypenated } from '../../utils';
import { GetStaticProps } from 'next';
import { SEOProps } from '../../components/SEO';
import { Grid, AspectRatioImage, Section, Text, ActivityIndicator, Navbar, Banner, Link, Semantic } from '../../components';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from '../../store';
import { podcastActions } from '../../store/ducks/podcast';
import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai';
import Styles from './index.styles';
const { classNames, StyleSheet } = Styles;

function CoverImage({
  podcast
}: {
  podcast: GetPodcast
}) {
  const dispatch = useDispatch();
  const firstEpisodeId = podcast.items[0].id;
  const isSelected = useSelector(s => s.podcast.episode?.id) === firstEpisodeId;
  const isPlaying = useSelector(s => s.podcast.playState) === 'play';

  const show = podcast.items[0]?.show

  return (
    <AspectRatioImage
      data={imgix(podcast.items[0].coverArt, {
        xs: {
          ...imgix.presets.lg('1:1'),
          crop: undefined
        }
      })}
      aspectRatio={1}
      className={classNames.imageShadow}
      Overlay={(
        <div className={classNames.imageOverlay}>
          {(isSelected && isPlaying) ? (
            <button 
              className={classNames.playButtonWrap}
              onClick={async () => {
                dispatch(podcastActions.pause());
              }}
            >
              <AiFillPauseCircle size={50}/>
            </button>
          ) : (
            <button 
              className={classNames.playButtonWrap}
              onClick={async () => {
                if (!isSelected && show) {
                  await dispatch(podcastActions.loadPodcast(show, firstEpisodeId));
                }
                dispatch(podcastActions.play());
              }}
            >
              <AiFillPlayCircle size={50}/>
            </button>
          )}
        </div>
      )}
    />
  );
}

function Podcast({
  podcast,
  reverse = false
}: {
  podcast: GetPodcast;
  reverse?: boolean
}) {
  return reverse ? (
    <Grid.Row cols={['2fr', '1fr']}>
      <Grid.Col xs={2} md={0}>
        <CoverImage podcast={podcast}/>
      </Grid.Col>
      <Grid.Col xs={2} md={1} className={classNames.podcastBody}>
        <Text variant='h1'>{podcast.items[0].show}</Text>
        <Text.Truncate 
          variant='p'
          numberOfLines={5}
        >
          {podcast.items[0].description}
        </Text.Truncate>
        <Link href={`/podcasts/${capitalizedToHypenated(podcast.items[0].show)}`}>More Episodes</Link>
      </Grid.Col>
      <Grid.Col xs={0} md={1}>
        <CoverImage podcast={podcast}/>
      </Grid.Col>
    </Grid.Row>
  ) : (
    <Grid.Row cols={['1fr', '2fr']}>
      <Grid.Col xs={2} md={1}>
        <CoverImage podcast={podcast}/>
      </Grid.Col>
      <Grid.Col xs={2} md={1} className={classNames.podcastBody}>
        <Text variant='h1'>{podcast.items[0].show}</Text>
        <Text.Truncate 
          variant='p'
          numberOfLines={5}
        >
          {podcast.items[0].description}
        </Text.Truncate>
        <Link href={`/podcasts/${capitalizedToHypenated(podcast.items[0].show)}`}>More Episodes</Link>
      </Grid.Col>
    </Grid.Row>
  );
}

function Podcasts({
  podcasts
} : {
  podcasts: GetPodcast[]
}) {
  const router = useRouter();
  Navbar.useDynamicHeader();

  if (router.isFallback) {
    return <ActivityIndicator.Screen/>;
  }
  
  return (
    <>
      <div className={classNames.page}>
        <Semantic role='main' skipNavContent pritable>
          <Banner text='Podcasts'/>

          {podcasts.map((podcast, i) => (
            <Section 
              classNameInside={classNames.podcastWrap} 
              key={podcast.items[0].id}
            >
              <Section.OffsetPadding>
                <Podcast 
                  podcast={podcast}
                  reverse={i % 2 === 0}
                />
              </Section.OffsetPadding>
            </Section>
          ))}
        </Semantic>
      </div>
      {StyleSheet}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const podcastSlugs = [
    'Targum Tea',
    'Keeping Score'
  ];

  const podcasts = await Promise.all(podcastSlugs.map(show => (
    actions.getPodcast({ show })
  )));

  const seo: SEOProps = {
    title: 'Podcasts'
  };

  return {
    props: { 
      podcasts: podcasts ?? [],
      seo
    }
  };
};

export default Podcasts;