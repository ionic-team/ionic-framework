import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Flat routes with a shared parent (/replace-sibling), registered directly in
 * the root outlet. A replace to one of these routes must only unmount the page
 * it replaces, not the siblings that are still in the back history.
 */

let homeMounts = 0;

export const ReplaceSiblingHome: React.FC = () => {
  const router = useIonRouter();
  const [mount] = useState(() => ++homeMounts);
  const [count, setCount] = useState(0);

  return (
    <IonPage data-pageid="replace-sibling-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="home-mount">{mount}</div>
        <div data-testid="home-count">{count}</div>
        <IonButton data-testid="increment" onClick={() => setCount((c) => c + 1)}>
          Increment
        </IonButton>
        <IonButton data-testid="open-new" routerLink="/replace-sibling/new">
          New item
        </IonButton>
        <IonButton data-testid="open-detail" routerLink="/replace-sibling/detail">
          Open detail
        </IonButton>
        <IonButton data-testid="open-redirect" routerLink="/replace-sibling-redirect">
          Open list through a redirect
        </IonButton>
        <IonButton
          data-testid="replace-through-gate"
          onClick={() => router.push('/replace-sibling-gate', 'forward', 'replace')}
        >
          Replace through a gate
        </IonButton>
        <IonButton data-testid="open-two-hop" routerLink="/replace-sibling/hop1">
          Open list through two redirects
        </IonButton>
        <TestDescription>
          Increment the counter, then open New item and tap Save. Save replaces the new item page with the list. Going
          back from the list should show this same page with the counter unchanged.
        </TestDescription>
      </IonContent>
    </IonPage>
  );
};

export const ReplaceSiblingDetail: React.FC = () => (
  <IonPage data-pageid="replace-sibling-detail">
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>Detail</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonButton data-testid="open-new" routerLink="/replace-sibling/new">
        New item
      </IonButton>
    </IonContent>
  </IonPage>
);

export const ReplaceSiblingNew: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage data-pageid="replace-sibling-new">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>New item</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton data-testid="save" onClick={() => router.push('/replace-sibling/list', 'forward', 'replace')}>
          Save
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export const ReplaceSiblingList: React.FC = () => (
  <IonPage data-pageid="replace-sibling-list">
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>List</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <p>The item list.</p>
    </IonContent>
  </IonPage>
);

let lessonContentMounts = 0;

/**
 * A lesson page followed by quiz questions that replace each other. The
 * routes share the parent /replace-sibling/lesson/:lessonId once the trailing
 * params are stripped, so the content page counts as a sibling of each
 * question.
 */
export const ReplaceSiblingLessonContent: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [mount] = useState(() => ++lessonContentMounts);
  const [count, setCount] = useState(0);

  return (
    <IonPage data-pageid="replace-sibling-lesson-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lesson {lessonId}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="lesson-mount">{mount}</div>
        <div data-testid="lesson-count">{count}</div>
        <IonButton data-testid="lesson-increment" onClick={() => setCount((c) => c + 1)}>
          Increment
        </IonButton>
        <IonButton data-testid="start-quiz" routerLink={`/replace-sibling/lesson/${lessonId}/quiz/1`}>
          Start quiz
        </IonButton>
        <TestDescription>
          Increment the counter, start the quiz, then tap Next question a few times. Each question replaces the previous
          one. Going back from any question should show this same page with the counter unchanged.
        </TestDescription>
      </IonContent>
    </IonPage>
  );
};

export const ReplaceSiblingLessonQuiz: React.FC = () => {
  const { lessonId, questionId } = useParams<{ lessonId: string; questionId: string }>();
  const router = useIonRouter();
  const next = Number(questionId) + 1;

  return (
    <IonPage data-pageid="replace-sibling-lesson-quiz">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Question {questionId}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="question-id">{questionId}</div>
        <IonButton
          data-testid="next-question"
          onClick={() => router.push(`/replace-sibling/lesson/${lessonId}/quiz/${next}`, 'forward', 'replace')}
        >
          Next question
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export const ReplaceSiblingGateTarget: React.FC = () => (
  <IonPage data-pageid="replace-sibling-gate-target">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Gate target</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <p>Reached through a gate that replaced itself.</p>
    </IonContent>
  </IonPage>
);

/**
 * Renders no IonPage and replaces itself with `to` on mount. Two of these in a
 * row form a two-hop redirect.
 */
export const ReplaceSiblingHop: React.FC<{ to: string }> = ({ to }) => {
  const router = useIonRouter();

  useEffect(() => {
    router.push(to, 'forward', 'replace');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
